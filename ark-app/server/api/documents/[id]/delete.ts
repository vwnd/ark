export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  console.log(`Deleting document with id ${id}`);
});
