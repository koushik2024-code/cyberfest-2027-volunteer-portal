import base64
import os

with open("public/images/ddc-logo-circle.png", "rb") as f:
    ddc_b64 = base64.b64encode(f.read()).decode("utf-8")

with open("public/images/cyberfest-logo-circle.png", "rb") as f:
    cyberfest_b64 = base64.b64encode(f.read()).decode("utf-8")

with open("public/images/qr-code-cyan.png", "rb") as f:
    qr_b64 = base64.b64encode(f.read()).decode("utf-8")

# Let's create an ultra-clean, punchy, high-contrast poster matching the sample layout:
# Top: Logos left, Club right, large "We're Recruiting!", 3D floating folder with items peeking out and live QR code + Apply Now pill, bottom roles row with sleek glassmorphism icon tiles.

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap');

  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}

  body {{
    width: 1080px;
    height: 1350px;
    background: radial-gradient(circle at 50% 25%, #071329 0%, #030712 60%, #02040a 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 55px 65px;
  }}

  /* High-end ambient lighting */
  .bg-grid {{
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 35%, black 20%, transparent 80%);
    pointer-events: none;
  }}

  .ambient-cyan {{
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 850px;
    height: 380px;
    background: radial-gradient(circle, rgba(0, 220, 255, 0.18) 0%, rgba(59, 130, 246, 0.1) 45%, transparent 75%);
    filter: blur(50px);
    pointer-events: none;
  }}

  .ambient-folder {{
    position: absolute;
    top: 480px;
    left: 50%;
    transform: translateX(-50%);
    width: 750px;
    height: 360px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 80%);
    filter: blur(45px);
    pointer-events: none;
  }}

  /* HEADER */
  .header {{
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .header-left {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}

  .logos-cluster {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}

  .logo-box {{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.85);
    border: 1.5px solid rgba(0, 240, 255, 0.4);
    padding: 6px;
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .logo-box img {{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }}

  .org-text {{
    display: flex;
    flex-direction: column;
  }}

  .org-name {{
    font-size: 21px;
    font-weight: 900;
    letter-spacing: 0.5px;
    color: #ffffff;
    text-transform: uppercase;
  }}

  .org-sub {{
    font-size: 13px;
    font-weight: 700;
    color: #38bdf8;
    letter-spacing: 0.5px;
  }}

  .header-right {{
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 22px;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.85);
    border: 1.5px solid rgba(0, 240, 255, 0.4);
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.18);
  }}

  .live-dot {{
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 12px #00f0ff;
  }}

  .header-right-text {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 1px;
  }}

  /* HERO TITLE */
  .hero-wrap {{
    position: relative;
    z-index: 10;
    text-align: center;
    margin-top: 15px;
  }}

  .hero-pre {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }}

  .hero-title {{
    font-size: 78px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -2px;
    text-transform: uppercase;
  }}

  .hero-title .were {{
    display: block;
    font-size: 44px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 2px;
    margin-bottom: 2px;
  }}

  .hero-title .recruiting {{
    background: linear-gradient(135deg, #00f0ff 0%, #38bdf8 45%, #60a5fa 75%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 45px rgba(0, 240, 255, 0.6));
  }}

  /* 3D FOLDER CARD CONTAINER (Styled like reference image) */
  .folder-stack {{
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 920px;
    margin: 30px auto 0 auto;
  }}

  /* Peeking top elements like the camera, figma, pen, mic in the user's reference image */
  .peeking-props {{
    position: absolute;
    top: -50px;
    left: 45px;
    right: 45px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 1;
    pointer-events: none;
  }}

  .prop-chip {{
    background: #0f172a;
    border: 1.5px solid rgba(0, 240, 255, 0.45);
    border-radius: 18px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.25);
  }}

  .prop-chip svg {{
    width: 22px;
    height: 22px;
    fill: none;
    stroke: #00f0ff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }}

  .prop-chip span {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 800;
    color: #f1f5f9;
  }}

  /* The actual Folder Card with rounded tab top */
  .folder-card {{
    position: relative;
    z-index: 5;
    background: linear-gradient(150deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 47, 73, 0.92) 100%);
    border: 2px solid rgba(0, 240, 255, 0.45);
    border-radius: 36px;
    padding: 42px 48px;
    box-shadow: 
      0 30px 70px -15px rgba(0, 0, 0, 0.95),
      0 0 50px rgba(0, 240, 255, 0.25),
      inset 0 1px 3px rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }}

  /* Left QR Frame */
  .qr-box {{
    background: #020617;
    border: 2px solid rgba(0, 240, 255, 0.45);
    border-radius: 26px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-shadow: 0 0 35px rgba(0, 240, 255, 0.25);
    flex-shrink: 0;
  }}

  .qr-box img {{
    width: 175px;
    height: 175px;
    border-radius: 14px;
  }}

  .qr-caption {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 800;
    color: #00f0ff;
    letter-spacing: 2px;
    text-transform: uppercase;
  }}

  /* Right Content */
  .folder-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }}

  .folder-heading {{
    font-size: 28px;
    font-weight: 900;
    line-height: 1.25;
    color: #ffffff;
  }}

  .folder-heading span {{
    color: #38bdf8;
    text-shadow: 0 0 25px rgba(56, 189, 248, 0.5);
  }}

  .bullet-list {{
    display: flex;
    flex-direction: column;
    gap: 12px;
  }}

  .bullet-row {{
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #cbd5e1;
  }}

  .check-icon {{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(0, 240, 255, 0.15);
    border: 1.5px solid #00f0ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }}

  .check-icon svg {{
    width: 14px;
    height: 14px;
    stroke: #00f0ff;
    stroke-width: 3;
    fill: none;
  }}

  /* Apply Now Button Pill matching the reference */
  .apply-pill {{
    align-self: flex-start;
    margin-top: 4px;
    background: #ffffff;
    color: #030712;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 900;
    font-size: 17px;
    padding: 14px 34px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3), 0 0 35px rgba(0, 240, 255, 0.45);
    letter-spacing: 0.3px;
  }}

  .pill-arrow {{
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #030712;
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .pill-arrow svg {{
    width: 16px;
    height: 16px;
    stroke: #ffffff;
    stroke-width: 2.5;
    fill: none;
  }}

  /* OPEN ROLES ROW (Icons at the bottom exactly like reference image) */
  .roles-wrap {{
    position: relative;
    z-index: 10;
    margin-top: 15px;
    text-align: center;
  }}

  .roles-header {{
    font-size: 26px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 22px;
    letter-spacing: 0.3px;
  }}

  .roles-row {{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    max-width: 950px;
    margin: 0 auto;
  }}

  .role-tile {{
    background: rgba(15, 23, 42, 0.75);
    border: 1.5px solid rgba(0, 240, 255, 0.3);
    border-radius: 20px;
    padding: 20px 10px 16px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  }}

  .role-tile-icon {{
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(59, 130, 246, 0.25) 100%);
    border: 1.5px solid rgba(0, 240, 255, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);
  }}

  .role-tile-icon svg {{
    width: 28px;
    height: 28px;
    stroke: #00f0ff;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }}

  .role-tile-name {{
    font-size: 13px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.25;
    text-align: center;
  }}

  /* FOOTER */
  .footer {{
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }}

  .footer-left {{
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 800;
    color: #f59e0b;
  }}

  .footer-left svg {{
    width: 16px;
    height: 16px;
    stroke: #f59e0b;
    stroke-width: 2.2;
    fill: none;
  }}

  .footer-right {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(0, 240, 255, 0.08);
    padding: 8px 18px;
    border-radius: 10px;
    border: 1px solid rgba(0, 240, 255, 0.25);
  }}
</style>
</head>
<body>

<div class="bg-grid"></div>
<div class="ambient-cyan"></div>
<div class="ambient-folder"></div>

<!-- HEADER -->
<div class="header">
  <div class="header-left">
    <div class="logos-cluster">
      <div class="logo-box">
        <img src="data:image/png;base64,{ddc_b64}" alt="DDC Logo">
      </div>
      <div class="logo-box">
        <img src="data:image/png;base64,{cyberfest_b64}" alt="CyberFest Logo">
      </div>
    </div>
    <div class="org-text">
      <div class="org-name">Digital Defence Club</div>
      <div class="org-sub">CBIT Hyderabad</div>
    </div>
  </div>

  <div class="header-right">
    <div class="live-dot"></div>
    <span class="header-right-text">CYBERFEST 2027</span>
  </div>
</div>

<!-- HERO HEADLINE -->
<div class="hero-wrap">
  <span class="hero-pre">Official Volunteer Recruitment Drive</span>
  <h1 class="hero-title">
    <span class="were">We&apos;re</span>
    <span class="recruiting">Recruiting!</span>
  </h1>
</div>

<!-- 3D FOLDER CARD -->
<div class="folder-stack">
  <!-- Top Peeking Props -->
  <div class="peeking-props">
    <div class="prop-chip">
      <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
      <span>Technical &amp; CTF</span>
    </div>
    <div class="prop-chip">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
      <span>Graphic Design</span>
    </div>
    <div class="prop-chip">
      <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
      <span>Media &amp; VFX</span>
    </div>
    <div class="prop-chip">
      <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
      <span>Public Relations</span>
    </div>
  </div>

  <!-- Folder Body -->
  <div class="folder-card">
    <div class="qr-box">
      <img src="data:image/png;base64,{qr_b64}" alt="Scan QR Code to Apply">
      <div class="qr-caption">Scan to Apply</div>
    </div>

    <div class="folder-content">
      <div class="folder-heading">
        Be the Backbone Behind Hyderabad&apos;s <span>Premier Cyber Conclave</span>
      </div>

      <div class="bullet-list">
        <div class="bullet-row">
          <div class="check-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span>Open to all active students of CBIT</span>
        </div>
        <div class="bullet-row">
          <div class="check-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span>Hands-on leadership &amp; event execution experience</span>
        </div>
        <div class="bullet-row">
          <div class="check-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span>Official organizing certificate &amp; institutional recognition</span>
        </div>
      </div>

      <div class="apply-pill">
        <div class="pill-arrow">
          <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
        <span>Apply Now</span>
      </div>
    </div>
  </div>
</div>

<!-- OPEN ROLES SECTION -->
<div class="roles-wrap">
  <div class="roles-header">Open For The Roles</div>
  <div class="roles-row">
    <!-- Technical -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
      </div>
      <div class="role-tile-name">Technical<br>&amp; CTF</div>
    </div>

    <!-- Graphic Design -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      </div>
      <div class="role-tile-name">Graphic<br>Design</div>
    </div>

    <!-- Public Relations -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
      </div>
      <div class="role-tile-name">Public<br>Relations</div>
    </div>

    <!-- Video Editing -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
      </div>
      <div class="role-tile-name">Video<br>Editing</div>
    </div>

    <!-- Sponsorship -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
      </div>
      <div class="role-tile-name">Sponsorship<br>&amp; Grants</div>
    </div>

    <!-- Operations & Events -->
    <div class="role-tile">
      <div class="role-tile-icon">
        <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
      </div>
      <div class="role-tile-name">Operations<br>&amp; Events</div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="footer">
  <div class="footer-left">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    <span>Deadline: 5th December 2026</span>
  </div>
  <div class="footer-right">
    cyberfest2027-volunteer-recruitment.vercel.app
  </div>
</div>

</body>
</html>
"""

with open("public/poster/poster.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Updated public/poster/poster.html with SVG icons and refined styling")
