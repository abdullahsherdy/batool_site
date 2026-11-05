const fs=require('node:fs'),vm=require('node:vm');
for(const f of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){
 const s=fs.readFileSync(f,'utf8');
 for(const m of s.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:f});
 if(/[\p{Extended_Pictographic}]/u.test(s))throw Error('Icon in '+f);
 for(const m of s.matchAll(/href="([^"#]+)"/g))if(!m[1].startsWith('http')&&!fs.existsSync(m[1]))throw Error('Missing link '+m[1]);
 console.log(f+': scripts, icons and links checked');
}
