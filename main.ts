import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";

export type Continuation = () => Promise<void>;

let resolve: () => void;
let reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

const dump = (ctx: Context) => {
  console.log(
    `The id ${ctx.state.userId} should be equal to ${ctx.request.url.pathname}.`
  );
};

const sayHello = async (ctx: Context) => {
  dump(ctx);

  // do something async, e.g. db, fs, etc.
  if (ctx.request.url.pathname === "/1") {
    await promise;
  }
  dump(ctx);

  if (ctx.request.url.pathname === "/2") {
    resolve();
  }

  ctx.response.body = `Result: ${ctx.state.userId} should be equal to ${ctx.request.url.pathname}.`;
};

// And this is from the Oak  FAQ (https://oakserver.github.io/oak/FAQ).
interface MyState {
  userId: string;
}

const app = new Application<MyState>();

app.use(async (ctx, next) => {
  // do whatever checks to determine the user ID
  // We'll take the path as the userid to prove the point
  ctx.state.userId = ctx.request.url.pathname;
  await next();
  // delete ctx.state.userId;
  ctx.state.userId = "whatever";
});

const router = new Router();
router
  .get("/1", sayHello) //
  .get("/2", sayHello);

app.use(router.routes());

await app.listen({ port: 1993 });
