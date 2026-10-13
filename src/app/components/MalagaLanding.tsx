import Link from "next/link";

type Lang="es"|"en";
const copy={
 es:{tag:"VERSHNYK · Málaga",title:"Montaje, adaptación y puesta a punto de viviendas",lead:"Soluciones prácticas para propietarios, viviendas y apartamentos en Málaga y Costa del Sol.",services:"Servicios",items:[["Montaje de cocinas","Montaje, ajuste y adaptación de cocinas, encimeras y mobiliario."],["Montaje de muebles","Muebles, armarios y soluciones a medida con ajustes de carpintería."],["Reformas interiores","Pladur, divisiones, acabados y trabajos de adaptación interior."],["Property setup","Preparación integral de una vivienda para vivir o alquilar: montaje, ajustes y pequeñas reparaciones."]],note:"Los trabajos pequeños se realizan como parte de un proyecto o con importe mínimo de desplazamiento.",cta:"Solicitar presupuesto",switch:"EN"},
 en:{tag:"VERSHNYK · Málaga",title:"Installation, adaptation & property setup",lead:"Practical solutions for homeowners, houses and apartments across Málaga and the Costa del Sol.",services:"Services",items:[["Kitchen installation","Installation, fitting and adaptation of kitchens, worktops and cabinetry."],["Furniture assembly","Furniture, wardrobes and fitted solutions with carpentry adjustments."],["Interior renovation","Drywall, partitions, finishing and interior adaptation work."],["Property setup","Complete preparation of a home for living or rental: assembly, adjustments and minor repairs."]],note:"Small jobs are offered as part of a larger project or subject to a minimum call-out charge.",cta:"Request a quote",switch:"ES"}
};
export default function MalagaLanding({lang}:{lang:Lang}){
 const c=copy[lang]; const other=lang==="es"?"/en":"/es";
 return <main style={{maxWidth:1120,margin:"0 auto",padding:"32px 20px 80px",fontFamily:"inherit"}}>
  <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:72}}>
   <Link href={lang==="es"?"/es":"/en"} style={{fontWeight:800,letterSpacing:2,textDecoration:"none",color:"inherit"}}>VERSHNYK</Link>
   <Link href={other} style={{border:"1px solid currentColor",borderRadius:999,padding:"8px 14px",textDecoration:"none",color:"inherit",fontWeight:700}}>{c.switch}</Link>
  </header>
  <section style={{maxWidth:820,marginBottom:72}}>
   <p style={{textTransform:"uppercase",letterSpacing:2,fontWeight:700,opacity:.7}}>{c.tag}</p>
   <h1 style={{fontSize:"clamp(42px,7vw,82px)",lineHeight:1.02,margin:"16px 0 24px"}}>{c.title}</h1>
   <p style={{fontSize:"clamp(19px,2.5vw,26px)",lineHeight:1.5,opacity:.82}}>{c.lead}</p>
  </section>
  <section>
   <h2 style={{fontSize:32,marginBottom:28}}>{c.services}</h2>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18}}>
    {c.items.map(([t,d])=><article key={t} style={{border:"1px solid rgba(127,127,127,.3)",borderRadius:18,padding:24}}><h3 style={{fontSize:22,marginTop:0}}>{t}</h3><p style={{lineHeight:1.6,opacity:.8}}>{d}</p></article>)}
   </div>
   <p style={{margin:"28px 0",opacity:.7}}>{c.note}</p>
   <a href="mailto:info@vershnyk.com" style={{display:"inline-block",padding:"14px 22px",borderRadius:999,background:"#111",color:"#fff",textDecoration:"none",fontWeight:700}}>{c.cta}</a>
  </section>
 </main>
}