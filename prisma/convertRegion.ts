
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_DIR = path.join(__dirname, "generated");

if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR);
}

function readJSON(file: string) {
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

/* ===========================
   PROVINCE
=========================== */

const provinces: any[] = [];

const provinceJSON = readJSON(
	path.join(DATA_DIR, "provinsi", "provinsi.json")
);

for (const [id, name] of Object.entries(provinceJSON)) {
	provinces.push({
		id,
		name,
	});
}

/* ===========================
   REGENCY
=========================== */

const regencies: any[] = [];

const regencyFolder = path.join(DATA_DIR, "kabupaten_kota");

for (const file of fs.readdirSync(regencyFolder)) {

	const match = file.match(/^kab-(\d+)\.json$/);

	if (!match) continue;

	const provinceId = match[1];

	const json = readJSON(path.join(regencyFolder, file));

	for (const [id, name] of Object.entries(json)) {

		regencies.push({
			id: `${provinceId}${id}`,
			provinceId,
			name,
		});

	}

}

/* ===========================
   DISTRICT
=========================== */

const districts: any[] = [];

const districtFolder = path.join(DATA_DIR, "kecamatan");

for (const file of fs.readdirSync(districtFolder)) {

	const match = file.match(/^kec-(\d+)-(\d+)\.json$/);

	if (!match) continue;

	const provinceId = match[1];
	const regencyCode = match[2];

	const regencyId = `${provinceId}${regencyCode}`;

	const json = readJSON(path.join(districtFolder, file));

	for (const [id, name] of Object.entries(json)) {

		districts.push({
			id: `${provinceId}${regencyCode}${id}`,
			regencyId,
			name,
		});

	}

}

/* ===========================
   VILLAGE
=========================== */

const villages: any[] = [];

const villageFolder = path.join(DATA_DIR, "kelurahan_desa");

for (const file of fs.readdirSync(villageFolder)) {

	const match = file.match(
		/^keldesa-(\d+)-(\d+)-(\d+)\.json$/
	);

	if (!match) continue;

	const provinceId = match[1];
	const regencyCode = match[2];
	const districtCode = match[3];

	const districtId =
		`${provinceId}${regencyCode}${districtCode}`;

	const json = readJSON(path.join(villageFolder, file));

	for (const [id, name] of Object.entries(json)) {

		villages.push({
			id: `${provinceId}${regencyCode}${districtCode}${id}`,
			districtId,
			name,
		});

	}

}

/* ===========================
   SAVE
=========================== */

fs.writeFileSync(
	path.join(OUTPUT_DIR, "provinces.json"),
	JSON.stringify(provinces, null, 2)
);

fs.writeFileSync(
	path.join(OUTPUT_DIR, "regencies.json"),
	JSON.stringify(regencies, null, 2)
);

fs.writeFileSync(
	path.join(OUTPUT_DIR, "districts.json"),
	JSON.stringify(districts, null, 2)
);

fs.writeFileSync(
	path.join(OUTPUT_DIR, "villages.json"),
	JSON.stringify(villages, null, 2)
);

console.log("Region converted successfully.");