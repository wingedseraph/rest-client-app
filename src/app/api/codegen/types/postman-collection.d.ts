declare module 'postman-collection' {
  export class Request {
    constructor(options: RequestOptions);
    addHeader: (header) => void;
  }

  export class HeaderList {
    constructor();
    add: (header) => void;
  }
}
