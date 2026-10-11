"use client";
import {useEffect,useRef,useState} from "react";
type Preview={file:File;url:string};
export default function PhotoPicker(){
 const [photos,setPhotos]=useState<Preview[]>([]);
 const [message,setMessage]=useState("");
 const input=useRef<HTMLInputElement>(null);
 const photosRef=useRef<Preview[]>([]);
 useEffect(()=>{photosRef.current=photos},[photos]);
 useEffect(()=>()=>{photosRef.current.forEach(p=>URL.revokeObjectURL(p.url))},[]);
 function choose(files:FileList|null){
  if(!files)return;
  const selected=Array.from(files);
  const allowed=["image/jpeg","image/png","image/webp","image/heic","image/heif"];
  const valid=selected.filter(f=>allowed.includes(f.type)||/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)).filter(f=>f.size<=10*1024*1024);
  const remaining=8-photos.length;
  const accepted=valid.slice(0,remaining);
  const next=[...photos,...accepted.map(file=>({file,url:URL.createObjectURL(file)}))];
  sync(next);
  if(valid.length!==selected.length)setMessage("Nur JPG, PNG, WebP oder HEIC bis 10 MB erlaubt.");
  else if(valid.length>remaining)setMessage("Maximal 8 Fotos möglich.");
  else setMessage("");
 }
 function sync(next:Preview[]){
  setPhotos(next);
  const transfer=new DataTransfer();
  next.forEach(p=>transfer.items.add(p.file));
  if(input.current)input.current.files=transfer.files;
 }
 function remove(index:number){
  const target=photos[index];if(target)URL.revokeObjectURL(target.url);
  sync(photos.filter((_,i)=>i!==index));setMessage("");
 }
 return <section className="quickPhotos photoPicker"><div className="photoPickerHeading"><b>Fotos hinzufügen <span>({photos.length}/8)</span></b><p>Optional – bis zu 8 Fotos, je max. 10 MB.</p></div>
 <input ref={input} className="photoPickerInput" type="file" name="photos" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple onChange={e=>{choose(e.currentTarget.files);}} aria-label="Projektfotos auswählen"/>
 <div className="photoPickerGrid">{Array.from({length:8},(_,i)=>{const p=photos[i];return p?<div key={i} className="photoPickerTile hasPhoto"><img src={p.url} alt={"Ausgewähltes Foto "+(i+1)}/><button type="button" onClick={()=>remove(i)} aria-label={"Foto "+(i+1)+" entfernen"}>×</button><span>✓</span></div>:<button key={i} type="button" className="photoPickerTile emptyPhoto" onClick={()=>input.current?.click()} aria-label="Foto hinzufügen"><span>+</span></button>})}</div>
 {message&&<p role="alert" className="photoPickerMessage">{message}</p>}
 </section>;
}
