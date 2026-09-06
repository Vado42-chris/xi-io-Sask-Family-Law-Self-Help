#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const root=process.cwd();
const template=JSON.parse(fs.readFileSync(path.join(root,'xiio','cross-cutting-blast-wave.template.json'),'utf8'));
const args=Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...v]=a.replace(/^--/,'').split('=');return [k,v.join('=')||true]}));
const input=args.input?JSON.parse(fs.readFileSync(path.resolve(root,String(args.input)),'utf8')):{};
const events=Array.isArray(input.events)?input.events:[];
const now=new Date().toISOString();
const impacts=[];
for(const e of events){
 const source=String(e.source||'unknown');
 const targets=[...(e.targets||e.affected_nodes||[])].map(String);
 const failureClass=String(e.failure_class||e.failureClass||'unknown');
 const layer=String(e.layer||'MESO').toUpperCase();
 const severity=Number(e.severity||0);
 const reach=Number(e.reach||targets.length);
 impacts.push({blast_id:template.project_id+'-'+now.replace(/[-:.TZ]/g,''),source,affected_nodes:targets,failure_class:failureClass,layer,severity,reach,owner_attention:e.owner_attention||'REQUIRED',evidence:e.evidence||[],repair:e.repair||'Investigate and repair at source, then re-run dependent checks.',next_action:e.next_action||'Issue the next triage action and append its receipt.',cadence:template.cadence[layer.toLowerCase()]||template.cadence.meso,ok_to_base:false});
}
const result={schema:'xiio.cross-cutting-blast-wave-result.v1',observed_at:now,repository:template.repository,project_id:template.project_id,framework_main_sha:template.framework_main_sha,event_count:events.length,impacts,status:events.length?'TRIAGE_ISSUED':'BLOCKED_NO_EVENTS',silent_failure_guard:events.length?'IMPACT_ASSESSED':'NO_EVENT_INPUT',backbeat:events.length?'Every supplied event received an impact assessment.':'No event input means no claim of safety.',forward:events.length?'Repair highest reach impact, then re-run the wave.':'Supply the first event, failed check, stale artifact, or open branch.'};
const out=path.join(root,'xiio','catalog','blast-wave-results.json');fs.mkdirSync(path.dirname(out),{recursive:true});const cat=JSON.parse(fs.readFileSync(out,'utf8'));cat.events.push(result);cat.updated_at=now;fs.writeFileSync(out,JSON.stringify(cat,null,2)+'\n');console.log(JSON.stringify(result,null,2));
