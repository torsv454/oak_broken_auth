Oakserver (https://github.com/oakserver) by default manages state in an object shared across all requests. That coupled with the recommendation to store the user identity in that shared object can lead to identity mixup if the routes contains asynchronous code (that is if the requests are not processed strictly in order).

I filed an issue against Oakserver (https://github.com/oakserver/oak/issues/249) and this repo is the code used in that issue.

## Running

´´´
deno run --allow-net main.ts
´´´
And

´´´
curl -X GET http://localhost:1993/1
´´´

And

´´´
curl -X GET http://localhost:1993/2
´´´

Which yields:

´´´
The id /1 should be equal to /1.
The id /2 should be equal to /2.
The id /2 should be equal to /2.
The id /2 should be equal to /1. // <--- This is not as intended.
´´´
