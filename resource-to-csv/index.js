const { ILert } = require("ilert");
const Papa = require("papaparse");
const fs = require("fs");
require("dotenv").config();

if(!process.env.ILERT_API_KEY) {
    throw new Error("It seems your api key is missing!");
}

const ilert = new ILert({
    apiKey: process.env.ILERT_API_KEY
});

const fetchResourcePage = (resource, index, maxResults) => {
    return ilert.call("GET", null, `/${resource}`, { "start-index": index, "max-results": maxResults }); 
}

const fetchResource = async (resource, pageSize = 25, timeoutSec = 180) => {

    // little safety net
    const _t = setTimeout(() => {
        console.log("timeout", timeoutSec, "reached, aborting..");
        process.exit(1);
    }, timeoutSec * 1000);

    let resources = [];
    let index = 0;
    while(true) {
        const page = (await fetchResourcePage(resource, index, pageSize)).data;
        index = index + pageSize;
        resources = resources.concat(page);
        if(!page || !page.length || page.length < pageSize) {
            break;
        }
    }

    clearTimeout(_t);
    return resources;
}

const writeCSV = async (resource, items) => {
    const csv = Papa.unparse(items);
    console.log("writing file...", csv.length);
    const file = `./${resource}-${Date.now()}.csv`;
    fs.writeFileSync(file, csv);
    console.log(file, "written.");
}

const main = async (resource) => {

    try {
        console.log("fetching", resource, "hold on...");
        const resources = await fetchResource(resource, 25, 180);
        console.log("fetched", resources.length, resource);
        await writeCSV(resource, resources);
    } catch(error) {
        console.log(error.message);
    }
}

//Arguments syntax resource={resource}
try {

    const args = process.argv
    let resource;
    args.map((value) => {
        if(value.startsWith("resource")) {
            const temp = value.split("=");
            resource = temp[1];
        }
    });

    if(resource) {
        resource = resource.replace('"', '');
        main(resource);
    } else {
        throw new Error("Not enought arguments given");
    }

} catch (error) {
    console.error(error);
}
