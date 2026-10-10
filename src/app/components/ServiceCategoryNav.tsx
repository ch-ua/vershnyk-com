"use client";
import {useState} from "react";
import {site} from "@/data/site";

const images=[
 ["/images/garten/Gartenpflege-Heckenschnitt-03.jpg","/images/garten/Gartenpflege-Heckenschnitt-vershnyk-com.jpg","/images/garten/Gartenpflege-Strauchschnitt.jpg"],
 ["/images/zaun/Anthrazit-Metallzaun.jpg","/images/zaun/Anthrazit-Metallzaun1.jpg","/images/zaun/Anthrazit-Metallzaun2.jpg"],
 ["/images/gatren-b/Gartenkonstruktion-Fundament-optimiert.jpg","/images/gatren-b/Gartenkonstruktion-Holz-Metall-01.jpg","/images/gatren-b/Gartenkonstruktionen-Spielplatz.jpg","/images/gatren-b/vershnyk-gartenbau-konstruktionen.jpg"],
 ["/images/montage/Moebelmontage-01.jpg","/images/montage/Moebelmontage-02.jpg","/images/montage/Moebelmontage-03.jpg","/images/montage/Moebelmontage-TV-Moebel-04.jpg"],
 ["/images/montage-k/Kuechenmontage-01.jpg","/images/montage-k/Kuechenmontage-02.jpg","/images/montage-k/Kuechenmontage-03.jpg","/images/montage-k/Kuechenmontage-04.jpg","/images/montage-k/Kuechenmontage-05.jpg","/images/montage-k/Kuechenmontage-06.jpg","/images/montage-k/Kuechenmontage-Montage-05.jpg"],
 ["/images/bau/Innenausbau-Dachgeschoss-01.jpg","/images/bau/Renovierung-Spachtelarbeiten-01.jpg","/images/bau/Renovierung-Trockenbau-01.jpg","/images/bau/Renovierung-Trockenbau-02.jpg"]
];
const routes=["gartenpflege","zaunmontage","gartenbau","moebelmontage","kuechenmontage","renovierung"];
const icons=[
 <svg key="garden" viewBox="0 0 48 48"><path d="M24 38V22M23 29C15 29 10 24 9 15c9 0 14 5 14 14Zm2-5c1-8 6-13 15-14-1 9-6 14-15 14Z"/></svg>,
 <svg key="fence" viewBox="0 0 48 48"><path d="M10 40V10M24 40V10M38 40V10M6 17h36M6 31h36M7 10l3-4 3 4M21 10l3-4 3 4M35 10l3-4 3 4"/></svg>,
 <svg key="build" viewBox="0 0 48 48"><path d="M7 24 24 9l17 15M11 21v19h26V21M19 40V28h10v12"/></svg>,
 <svg key="furniture" viewBox="0 0 48 48"><path d="M13 7h22v34H13zM24 7v34M19 23h2M27 23h2M10 41h28"/></svg>,
 <svg key="kitchen" viewBox="0 0 48 48"><path d="M12 10v28M7 10v10c0 5 10 5 10 0V10M24 10v28M34 10v28M34 10c8 3 8 14 0 18"/></svg>,
 <svg key="reno" viewBox="0 0 48 48"><path d="m10 31 18-18 8 8-18 18H10v-8ZM25 16l8 8M31 10l7 7"/></svg>
];

export default function ServiceCategoryNav(){
 const [pics]=useState(()=>images.map(group=>group[Math.floor(Math.random()*group.length)]));
 return <section className="serviceCategoryNav">
  <div className="sectionTitle"><p className="hand">Unsere Leistungen</p><h2>ALLES AUS EINER HAND</h2></div>
  <div className="serviceGrid">
   {site.serviceDetails.map((s,i)=><a className="serviceNavCard" href={"/leistungen/"+routes[i]} key={s.title}>
    <div className="servicePhoto" style={{backgroundImage:`url("${pics[i]}")`}}><span className="serviceIcon" aria-hidden="true">{icons[i]}</span></div>
    <h3>{s.title}</h3><ul>{s.items.map(x=><li key={x}>{x}</li>)}</ul>
   </a>)}
  </div>
 </section>;
}