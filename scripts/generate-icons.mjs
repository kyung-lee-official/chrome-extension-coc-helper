import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const variants = [
	{ src: "src/assets/react.svg", name: "icon" },
	{ src: "src/assets/react-lime.svg", name: "icon-active" },
];
const sizes = [16, 32, 48, 128];

mkdirSync("public/icons", { recursive: true });

for (const { src, name } of variants) {
	const svg = readFileSync(src, "utf8");
	for (const size of sizes) {
		const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } });
		const png = resvg.render().asPng();
		writeFileSync(`public/icons/${name}-${size}.png`, png);
		console.log(`${name}-${size}.png`);
	}
}
