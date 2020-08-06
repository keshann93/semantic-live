<div align="center">
<img src="https://i.ibb.co/BC6wx72/banner.png" />
<br />
</div>

<br />
<h1 align="center">📝 Semantic UI / HTML Previewer
</h1>

##### Semantic-live introduces a Real-time HTML previewer into Visual Studio Code supports Semantic UI templates.

![Visual Studio Marketplace Version](https://vsmarketplacebadge.apphb.com/version/keshan.semantic-live.svg)
![Visual Studio Marketplace Installs](https://vsmarketplacebadge.apphb.com/installs/keshan.semantic-live.svg)
![Visual Studio Marketplace Downloads](https://vsmarketplacebadge.apphb.com/downloads/keshan.semantic-live.svg)

## Introduction

- Semantic-live is an extension that provides you with many useful functionalities including a live previewer for html, js & css including semmantic-UI library
- Why [Semantic UI](http://semantic-ui.com) ? It is an awesome library with excellent components that you can use to quickly
  build web interfaces. But I felt like it would be nicer if we can compose bunch of elements and see in realtime how they
  fit together. That's why Semantic-live.
- Feel free to ask questions, [post issues](https://github.com/keshann93/semantic-live/issues), submit pull request, and request new features.
- For more information about this project and how to use this extension, please check out below sections ⬇︎

## How?

Copy the following Semantic-UI markup to the vscode html extension file.

```html
<div class="ui card">
  <div class="image">
    <img src="http://semantic-ui.com/images/avatar2/large/kristy.png" />
  </div>
  <div class="content">
    <a class="header">Kristy</a>
    <div class="meta">
      <span class="date">Joined in 2013</span>
    </div>
    <div class="description">
      Kristy is an art director living in New York.
    </div>
  </div>
  <div class="extra content">
    <a>
      <i class="user icon"></i>
      22 Friends
    </a>
  </div>
</div>
```

You could copy and paste any [Semantic UI components](http://semantic-ui.com/elements/button.html).

## Features

Semantic-live supports the followings

- 💅 Renders instantly any `html` document with its content. It does not support rendering of html which includes `frontend frameworks` or `libraries` (simple html rendering)
- 🎨 Supports `css` and `js` that gets added within `link` & `script` tags, whether external files or inline code it will render them
- 🌈 Supports `semantic-ui` library component rendering
- 🌏 Re-renders any changes that was made for current html file or any `javascript`/`css` files that are linked to a html file
- 🌟 Beautifier

## Getting started

- Install the [Semantic-live](https://marketplace.visualstudio.com/items?itemName=keshan.semantic-live) extension in VS Code
- After opening a `html` file, click on the <img src="https://raw.githubusercontent.com/keshann93/semantic-live/master/icons/tiny-icon.png" width="20px" /> icon to toggle the side-bar
- Place your cursor in the html content
- You should see the sidebar tries to render the html content

## Demo

<img src="https://raw.githubusercontent.com/keshann93/semantic-live/master/assets/semantic-live-demo.gif">

## What's Under the Hood?

TypeScript!

Semantic-live uses the following

- [Semantic UI](http://semantic-ui.com)

## Changelog

Please check the [Releases](./CHANGELOG.md) \| [Github](https://github.com/keshann93/semantic-live/releases) page of this project.

## Contributing

Have a look at our [contribution guide](./contributing.md).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://keshShan.github.io"><img src="https://avatars3.githubusercontent.com/u/12506034?v=4" width="100px;" alt="Keshan Nageswaran"/><br /><sub><b>Keshan Nageswaran</b></sub></a><br /><a href="https://github.com/keshann93/semantic-live/commits?author=keshann93" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT License](./LICENSE)
