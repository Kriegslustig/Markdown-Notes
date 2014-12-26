<?

class Utilities {
  /**
   * Sets an infinite loop in which a callback is calle
   *
   * @access public
   *
   * @param miliseconds $timeout
   * @param anonymous function $callback
   *
   * @uses $callback()
   * @uses usleep()
   */
  public static function set_interval ($timeout, $callback) {
    $timeout = $timeout * 1000;
    while (true) {
      usleep($timeout);
      $callback();
    }
  }
}