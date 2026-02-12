export async function loadMap(name) {
  const response = await fetch(`assets/maps/${name}.json`);
  return await response.json();
}
