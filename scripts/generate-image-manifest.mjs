import {readdirSync,writeFileSync,mkdirSync} from "node:fs";
import {join} from "node:path";

const root=join(process.cwd(),"public","images");
const categories={
  garden:"garten",
  fence:"zaun",
  construction:"gatren-b",
  furniture:"montage",
  kitchen:"montage-k",
  renovation:"bau"
};

const manifest={};
for(const [key,folder] of Object.entries(categories)){
  const dir=join(root,folder);
  manifest[key]=readdirSync(dir,{withFileTypes:true})
    .filter(entry=>entry.isFile() && /\.jpg$/i.test(entry.name))
    .map(entry=>"/images/"+folder+"/"+entry.name)
    .sort((a,b)=>a.localeCompare(b,"de"));
}
const target=join(process.cwd(),"src","data","image-manifest.json");
mkdirSync(join(process.cwd(),"src","data"),{recursive:true});
writeFileSync(target,JSON.stringify(manifest,null,2)+"\n","utf8");
console.log("Image manifest generated:",Object.fromEntries(Object.entries(manifest).map(([k,v])=>[k,v.length])));
