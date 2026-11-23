import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * CyberFest 2027 Production Deployment Automation Script
 */
async function deploy() {
  console.log('================================================================');
  console.log('CYBERFEST 2027 — PRODUCTION DEPLOYMENT & VERIFICATION PIPELINE');
  console.log('================================================================\n');

  // 1. Audit Build
  console.log('Step 1: Running production build verification...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Build successful.\n');
  } catch (err) {
    console.error('✗ Build failed. Aborting deployment.');
    process.exit(1);
  }

  // 2. Read environment variables from .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let envConfig = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        envConfig[k.trim()] = v.join('=').trim();
      }
    }
  }

  console.log('Step 2: Auditing production environment configuration...');
  const hasSupabase = Boolean(
    envConfig.NEXT_PUBLIC_SUPABASE_URL &&
    envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !envConfig.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
  );

  console.log(`- Supabase Cloud configured: ${hasSupabase ? 'YES' : 'NO (Using resilient on-disk engine)'}`);
  console.log(`- Admin default email: ${envConfig.ADMIN_EMAIL || 'admin@cbit.ac.in'}`);
  console.log('');

  // 3. Vercel Deployment Check
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    console.log('Notice: VERCEL_TOKEN environment variable not set.');
    console.log('To deploy directly via Vercel CLI, provide VERCEL_TOKEN or log in via `vercel login`.');
    console.log('Alternatively, link this repository to Vercel via the Vercel Web Dashboard (https://vercel.com/new).\n');
  } else {
    console.log('Step 3: Deploying to Vercel Production via CLI...');
    const cmd = `vercel deploy --prod --token=${vercelToken} --yes`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('✓ Vercel production deployment triggered successfully.\n');
  }
}

deploy().catch((err) => {
  console.error('Deployment pipeline error:', err);
  process.exit(1);
});
