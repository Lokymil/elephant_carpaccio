# Python

This program is a bootstrap you will have to hack to earn points !

## Install

You need to have installed:

- [Python 3](https://www.python.org/downloads/)
- [PIP 3](https://pypi.org/project/pip/)

## Setup

To make it work, you have to change properties in [`config.py`](./config.py) as:

- `host`: IP provided by your workshop leader
- `name`: your own name, team name or anything that can identify you. Be careful, if you have the same name as someone else in this workshop, your connection will be refused.

## How can I start the server ?

First move to client folder:

```sh
cd client-python
```

#### Install dependencies

Use `pip` (or `pip3` depending on your configuration) to install `python-socketio[client]` :

```sh
# With pip
pip install "python-socketio[client]"

# With pip3
pip3 install "python-socketio[client]"
```

#### Start your server

Start your server with this command:

```sh
py -B client.py
```

:warning: If it works, stop here until your workshop leader presses the "start" button. When the timer has started, you can code.

## What should I do to earn points ?

To parse a cart properly, you have to change the `generate_invoice` function in [`invoice/invoice.py`](./invoice/invoice.py) and return the correct invoice value.

To know what rules you will have to create, ask your team leader.
