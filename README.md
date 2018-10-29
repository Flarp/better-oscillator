# better-oscillator

Improved oscillator for the WebAudio API using the new Audio Worklet API. It is currently only usable in Chrome.

Exposes the following parameters:
* `frequency`:
  * Min: 1
  * Max: Infinity
  * Default: 440
  * Description: Frequency at which the oscillator will vibrate at.
* `wave`:
  * Min: 0
  * Max: 4
  * Default: 0
  * Description: Sets the waveform of the oscillator. If the number is not an integer, it will be rounded down.
    * 0 - triangle
    * 1 - sawtooth
    * 2 - pulse
    * 3 - sine
