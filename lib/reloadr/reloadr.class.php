<?php
require 'utilities.class.php';

class Reloadr {
  private $filemtime_index = [];
  private $check_this_dir = '../';
  private $ignores = '/(.*\.DS_Store|.*\.git.*)/';
  private $callback;

  /**
   * Instanciates the event_stream and sets the needed headers
   *
   * @access public
   *
   * @param anonymous function $callback This will be called when a file changes
   *
   * @uses Event_stream
   * @uses Reloadr::$event_stream
   * @uses Reloadr::$event_stream::set_headers
   */
  public function __construct ($callback) {
    $this->callback = $callback;
  }

  /**
   * Set the ignore array
   *
   * @access public
   *
   * @param regex array $string Contains all regex to be ignored
   * @var regex array Structure: /regex/, /regex/
   *
   * @uses Reloadr::$ignores
   * @uses str_replace()
   */
  public function set_ignores($string) {
    $this->ignores = '/(' . str_replace(', ', '|') . ')/';
  }

  /**
   * Sets the directory to watch
   *
   * @access public
   *
   * @param string $dir The path (relative or absolute) to the dir to watch
   *
   * @uses Reloadr::check_this_dir
   */
  public function set_dir ($dir) {
    $this->check_this_dir = $dir;
  }

  /**
   * Sets the file watcher
   *
   * @access public
   *
   * @uses Reloadr::create_index
   * @uses Reloadr::check_for_updates
   * @uses Utitlities::set_interval
   */
  public function set_listener () {
    $this->create_index($this->check_this_dir);
    Utilities::set_interval(500, function () {
      $this->check_for_updates($this->check_this_dir);
    });
  }

  /**
   * Indexes all files in the directory and writes it into Reloadr::filemtime_index
   *
   * @access private
   *
   * @param path $where Defines the directory to index
   * @type path A relative or absolute path
   *
   * @uses Reloadr::for_every_file
   * @uses Reloadr::$filemtime_index
   * @uses filemtime()
   */
  private function create_index ($where) {
    $this->for_every_file ($where, function ($abs_file_path) {
      $this->filemtime_index[$abs_file_path] = filemtime($abs_file_path);
    });
  }

  /**
   * Checks all filemtimes against the recorded ones
   *
   * @access private
   *
   * @param path $where Defines the directory to check
   * @type path A relative or absolute path
   *
   * @uses Reloadr::for_every_file
   * @uses Reloadr::$callback()
   * @uses Reloadr::$filemtime_index
   * @uses filemtime
   *
   * @todo find out if there's a better solution to #thisisfuckingugly
   */
  private function check_for_updates ($where) {
    $this->for_every_file ($where, function ($file) {
      $this_filemtime = filemtime($file);
      if($this_filemtime !== $this->filemtime_index[$file]) {
        // #thisisfuckingugly
        $callback = $this->callback;
        $callback();
      }
    });
  }

  /**
   * Loops through a directory recursively and executes a callback on every file
   *
   * @access private
   *
   * @param path $dir The directory to loop through
   * @param anonymous function $callback Is executed on every file
   *
   *     $callback($abs_path);
   *
   * @uses Reloadr::for_every_file
   * @uses scandir()
   * @uses realpath()
   * @uses is_dir()
   * @uses is_file()
   * @uses $callback()
   */
  private function for_every_file ($dir, $callback) {
    $dir_scan = scandir($dir);
    foreach($dir_scan as $value) {
      if($value !== '.' && $value !== '..') {
        if(!$this->should_ignore($value)) {
          $abs_path = realpath($dir.'/'.$value);
          if(is_dir($abs_path)) {
            $this->for_every_file($abs_path, $callback);
          } else if (is_file($abs_path)) {
            $callback($abs_path);
          }
        }
      }
    }
  }

  /**
   * Checks if a file or directory should be ignored
   *
   * @access private
   *
   * @param path $filepath An absolute filepath
   *
   * @uses this::$ignores
   * @uses preg_match()
   *
   * @return bool
   */
  private function should_ignore ($filepath) {
    $preg_match_ret = preg_match($this->ignores, $filepath);
    if($preg_match_ret === 1) {
      return true;
    }
    return false;
  }
}