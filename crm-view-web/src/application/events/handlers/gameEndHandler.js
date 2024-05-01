/**
 * @type {import('@/application/events').EventHandler}
 */
async function handle(event, context) {
  console.log("############# Game Event: 'Game end' received");
}

export default {
  handle
};
