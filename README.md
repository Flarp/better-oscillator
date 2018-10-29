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
  * Max: 3
  * Default: 3
  * Description: Sets the waveform of the oscillator. If the number is not an integer, it will be rounded down.
    * 0 - triangle
    * 1 - pulse
    * 2 - sawtooth
    * 3 - sine
* `phase`:
 * Min: 0
 * Max: Infinity
 * Default: 0
 * Description: Controls the phase offset of the waveform.
* `sync`:
 * Min: 0
 * Max: Infinity
 * Default: 0
 * Description: Sets frequency to which the oscillator will [hard sync](https://en.wikipedia.org/wiki/Oscillator_sync#Hard_Sync) to.
