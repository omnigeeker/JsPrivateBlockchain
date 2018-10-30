# Private Blockchain with javascript

I build a RESTful API using a Node.js framework that will interface with the private blockchain

## Getting Started

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js web site)[https://nodejs.org/en/].

I use hapijs as the framework of RESTful API.

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
npm install
```

## Running

Run the main program.

```
node app.js
```
If there is no blocks in local leveldb, then it will generate 10 block automaticly.


## Running Tests

1. Get

Use

```
curl http://localhost:8000/block/0
```

The result is:

```
{"hash":"baa252c346f465ede6ecad67f2262561a6f732b67fa7d86851d43e0ec9611b1f","height":0,"body":"test data 0","time":"1540433208","previousBlockHash":""}
```

You can see the blocks weith block height like this

```
curl http://localhost:8000/block/9
```

If there is more than 10 blocks, then the result is:

```
{"hash":"fc9c499f5a2be1be0d77572e8afba24d06ab38eceaf637519dc53dbaaf1544d8","height":9,"body":"test data 9","time":"1540433208","previousBlockHash":"d008f64d8d859065297afe7881c81be42cf37e3dfde3051c1fe1284e70ace2dc"}
```


2. Post

Use wFetch which is a windows HTTP request and response tool;

```
POST /block HTTP/1.0\r\n
Content-Type: application/json\r\n
Host: localhost\r\n
Accept: */*\r\n
Content-Length:25\r\n
\r\n
{"body": "New block data"}
```

Then New Block will added to leveldb

Response is:

```
HTTP/1.1 200 OK\r\n
content-type: text/html; charset=utf-8\r\n
cache-control: no-cache\r\n
content-length: 218\r\n
Date: Thu, 25 Oct 2018 02:34:37 GMT\r\n
Connection: close\r\n
\r\n
{"hash":"9db9c992236814185b9df7de3fc12bddca672ab5a0d27dfa603ee51d3ce7a85d","height":18,"body":"New block data","time":"1540434877","previousBlockHash":"c6ec66cfb9a498218750128b16f7b178b453560f56becea8e418b6aa7a26b732"}
```

If the HTTP body is empty, it will validate the chain, like this

```
POST /block HTTP/1.0\r\n
Host: localhost\r\n
Accept: */*\r\n
\r\n
```

The response is:

```
HTTP/1.1 200 OK\r\n
content-type: text/html; charset=utf-8\r\n
cache-control: no-cache\r\n
content-length: 33\r\n
Date: Thu, 25 Oct 2018 02:37:33 GMT\r\n
Connection: close\r\n
\r\n
validateChain: No errors detected
```

## License

This project is licensed under the GNU License

## Acknowledgments

* etc
