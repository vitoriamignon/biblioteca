// test-deploy-simple.js
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 TESTE PRÉ-DEPLOY SIMPLES\n');

let allTestsPassed = true;

// Teste 1: Arquivos essenciais existem
console.log('1. 📁 Verificando arquivos essenciais...');
const essentialFiles = [
  'lib/actions.ts',
  'lib/turso.ts', 
  'lib/types.ts',
  'app/dashboard/page.tsx',
  'app/library/page.tsx',
  'next.config.js',
  'package.json'
];

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTANDO`);
    allTestsPassed = false;
  }
});

// Teste 2: Verificar se lib/actions.ts tem as funções necessárias
console.log('\n2. 📦 Verificando funções no actions.ts...');
try {
  const actionsContent = fs.readFileSync('lib/actions.ts', 'utf8');
  const requiredFunctions = ['getStats', 'getBooks', 'getGenres', 'createBook', 'updateBook'];
  
  requiredFunctions.forEach(func => {
    if (actionsContent.includes(`export async function ${func}`) || 
        actionsContent.includes(`export function ${func}`)) {
      console.log(`   ✅ ${func}`);
    } else {
      console.log(`   ❌ ${func} - Não exportada`);
      allTestsPassed = false;
    }
  });
} catch (error) {
  console.log('   ❌ Erro ao ler actions.ts:', error.message);
  allTestsPassed = false;
}

// Teste 3: Verificar package.json
console.log('\n3. 📋 Verificando package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Verificar scripts
  const requiredScripts = ['dev', 'build', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ Script: ${script}`);
    } else {
      console.log(`   ❌ Script faltando: ${script}`);
      allTestsPassed = false;
    }
  });
  
  // Verificar dependências
  console.log(`   ℹ️  Next.js: ${packageJson.dependencies?.next || 'Não encontrado'}`);
  
} catch (error) {
  console.log('   ❌ Erro no package.json:', error.message);
  allTestsPassed = false;
}

// Teste 4: Build do Next.js (TESTE PRINCIPAL)
console.log('\n4. 🏗️  Testando build do Next.js...');
try {
  console.log('   📝 Executando npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('   ✅ BUILD COMPLETADO COM SUCESSO!');
} catch (error) {
  console.log('   ❌ BUILD FALHOU!');
  console.log('   💡 Erro durante o build - corrija antes do deploy');
  allTestsPassed = false;
}

// RESULTADO FINAL
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 TODOS OS TESTES PASSARAM!');
  console.log('🚀 PRONTO PARA DEPLOY!');
  console.log('\n📝 Execute:');
  console.log('   vercel --prod');
} else {
  console.log('❌ ALGUNS TESTES FALHARAM!');
  console.log('💡 Corrija os problemas antes do deploy.');
  process.exit(1);
}
console.log('='.repeat(50));