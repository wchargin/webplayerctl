# webplayerctl

Simple web interface to [playerctl], allowing you to control media
players on the host from any device with network access. That is, it
turns your smartphone into a rudimentary control for your running media.

## Usage

First, install packages (`npm install`) and the [`playerctl`
command-line utility][playerctl-install], which may be available in your
package manager.

Then, `node .` and navigate to <http://localhost:3000>. This listens on
all addresses, so if your machine is available over an intranet as
`machine`, then you can reach it at `http://machine:3000`. To use a
different port, set the `PORT` environment variable.

[playerctl]: https://github.com/altdesktop/playerctl
[playerctl-install]: https://github.com/altdesktop/playerctl?tab=readme-ov-file#installing
