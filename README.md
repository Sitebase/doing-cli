# Doing CLI tool

This is a simple tool to help developers to track what they are working on using [Toggl](https://www.toggl.com).
Face it, everyone hates these cluncky interfaces for just starting something simple like a timer.

![Cover image timer](cover.jpg)

## Usage

    doing development

When you start to work on something else you type:

    doing meeting

and when you want to take a break you can use:

    doing stop

## Install

Run following command:

    npm install -g git+https://git@github.com/bubobox/doing-cli.git

Add to you `bash` or `zsh` profile an extra environment variable that contains the toggl API key:

    export TOGGL_API_TOKEN="your-key-here"
