#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const root=process.cwd();
const template=JSON.parse(fs.readFileSync(path.join(root,'xiio','owner-cognitive-load.template.json'),'utf8'));
const args=Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...v]=a.replace(/^--/,'').split('=');return [k,v.join('=')||true]}));
const input=args.input?JSON.parse(fs.readFileSync(path.resolve(root,String(args.input)),'utf8')):{};
const items=Array.isArray(input.items)?input.items:[];
const key=i=>String(i.key||i.title||i.id||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const groups=new Map();
for(const item of items){const k=key(item)||'unkeyed';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(item);}
const unique=[...groups.values()].map(group=>({...group[0],source_count:group.length,sources:group.map(x=>x.source||x.repo||'unknown')}));
const unresolved=unique.filter(i=>!['done','closed','merged','resolved'].includes(String(i.state||'').toLowerCase()));
const owner=unresolved.filter(i=>i.owner_action||i.owner||i.authority);
const next=input.next_action||template.default_next_action;
const raw=items.length, uniq=unique.length, collapsed=Math.max(0,raw-uniq);
const brief=unresolved.length?(`${unresolved.length} unresolved items remain across ${new Set(unresolved.map(i=>i.repo||i.project||template.project_id)).size} work areas. ${owner.length} require owner or authority action. Highest reach item: ${unresolved[0].title||unresolved[0].key||'unnamed'}. Next: ${next}`):'No unresolved items were supplied. Verify that the inventory is complete before claiming relief.';
const now=new Date().toISOString();
const result={schema:'xiio.owner-cognitive-load-result.v1',result_id:template.project_id+'-'+now.replace(/[-:.TZ]/g,''),observed_at:now,repository:template.repository,project_id:template.project_id,raw_attention_items:raw,unique_attention_items:uniq,collapsed_items:collapsed,owner_decisions:owner.length,unresolved_gates:unresolved.length,attention_reduction_ratio:raw?Number((collapsed/raw).toFixed(3)):0,duplicate_collapse_ratio:raw?Number((collapsed/raw).toFixed(3)):0,stew_residue_count:unresolved.length,audio_brief:brief,next_action:next,attention_delta:input.attention_delta||`Collapsed ${collapsed} duplicate attention items; ${unresolved.length} unresolved items remain.`,evidence:input.evidence||[],status:items.length?'MEASURED_WITH_OPEN_WORK':'BLOCKED_NO_INVENTORY',ok_to_base:false,effect_authority:'DENIED'};
const out=path.join(root,'xiio','catalog','owner-cognitive-load-results.json');fs.mkdirSync(path.dirname(out),{recursive:true});const cat=JSON.parse(fs.readFileSync(out,'utf8'));cat.events.push(result);cat.updated_at=now;fs.writeFileSync(out,JSON.stringify(cat,null,2)+'\n');console.log(JSON.stringify(result,null,2));
