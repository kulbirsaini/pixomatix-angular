## Pixomatix-Api

[Pixomatix-Api](https://github.com/kulbirsaini/pixomatix-api) is a Photo Gallery API powered by [Ruby on Rails](http://rubyonrails.org/) (4.2.1).

## Pixomatix-Angular

Pixomatix-Angular is an [Angularjs](https://angularjs.org/) (1.3) powered front-end for Pixomatix-API.

**Demo** : [angular.pixomatix.com](http://angular.pixomatix.com/)

## Configuration

### App Configuration

Config File : `app/assets/js/constants.js`

```javascript
// Configuration for development environment
angular.module("PixomatixConfig.development", []).constant('Config', {
  api_url: 'http://localhost:1234/api', // URL to API
  api_version: 'v1'                    // API Version
});

// Configuration for production environment
angular.module("PixomatixConfig.production", []).constant('Config', {
  api_url: 'http://api.pixomatix.com/api',
  api_version: 'v1'
});
```

## About Me
Senior Developer / Programmer,
Hyderabad, India

## Contact Me
Kulbir Saini - contact [AT] saini.co.in / [@_kulbir](https://twitter.com/_kulbir)

## License
Copyright (c) 2015 Kulbir Saini

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
