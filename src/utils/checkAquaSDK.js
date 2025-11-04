import Aquafier from 'aqua-js-sdk';

export function diagnoseAquaSDK() {
  const aquafier = new Aquafier();
  
  console.log('=== AQUA SDK DIAGNOSTIC ===');
  console.log('Aquafier instance:', aquafier);
  console.log('\nAvailable methods:');
  
  const proto = Object.getPrototypeOf(aquafier);
  const methods = Object.getOwnPropertyNames(proto).filter(
    name => typeof aquafier[name] === 'function'
  );
  
  methods.forEach(method => {
    console.log(`  - ${method}()`);
  });
  
  console.log('\nAvailable properties:');
  Object.keys(aquafier).forEach(prop => {
    console.log(`  - ${prop}: ${typeof aquafier[prop]}`);
  });
  
  console.log('=========================');
  
  return { aquafier, methods };
}