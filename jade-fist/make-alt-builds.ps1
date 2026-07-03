# JF-#024: generate GameMonetize / GameDistribution builds from the CG master.
# Run from jade-fist\: powershell -File make-alt-builds.ps1
# index.html stays the CrazyGames source of truth; this swaps only the two
# SDK-marked blocks. Fill the placeholder game IDs and verify each platform's
# current SDK docs before actually submitting an alt build.
$ErrorActionPreference = 'Stop'
$src = Get-Content "$PSScriptRoot\index.html" -Raw

$gmHead = @'
<!-- SDK:HEAD:BEGIN -->
<!-- JF-#024: GameMonetize SDK - fill gameId + verify docs before submitting -->
<script>window.SDK_OPTIONS = { gameId: "GM_GAME_ID_HERE", onEvent: function(a){
  if (a.name === "SDK_REWARDED_WATCH_COMPLETE" && window.__gmReward){ var f = window.__gmReward; window.__gmReward = null; f(); }
}};</script>
<script src="https://api.gamemonetize.com/sdk.js"></script>
<!-- SDK:HEAD:END -->
'@

$gmAdapter = @'
// SDK:ADAPTER:BEGIN
// ------------------------------------------ GameMonetize adapter (JF-#024) --
// Same CG facade the game calls everywhere; graceful no-op off-platform.
let sdkLive = false;
const CG = {
  init(cb){ sdkLive = !!window.sdk; cb && cb(); },
  loadingStart(){}, loadingStop(){}, gameplayStart(){}, gameplayStop(){}, happytime(){}, submitScore(s){},
  interstitial(){ try{ if (window.sdk && window.sdk.showBanner) window.sdk.showBanner(); }catch(e){} },
  rewarded(onReward){
    try{ if (window.sdk && window.sdk.showRewardedBanner){
      window.__gmReward = onReward; window.sdk.showRewardedBanner(); return;
    } }catch(e){}
    onReward && onReward();
  },
};
CG.init(() => {});
// SDK:ADAPTER:END
'@

$gdHead = @'
<!-- SDK:HEAD:BEGIN -->
<!-- JF-#024: GameDistribution SDK - fill gameId + verify docs before submitting -->
<script>window.GD_OPTIONS = { gameId: "GD_GAME_ID_HERE", onEvent: function(e){} };
(function(d, s, id){ var js, f = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return; js = d.createElement(s); js.id = id;
  js.src = "https://html5.api.gamedistribution.com/main.min.js";
  f.parentNode.insertBefore(js, f);
})(document, "script", "gamedistribution-jssdk");</script>
<!-- SDK:HEAD:END -->
'@

$gdAdapter = @'
// SDK:ADAPTER:BEGIN
// -------------------------------------- GameDistribution adapter (JF-#024) --
// Same CG facade the game calls everywhere; graceful no-op off-platform.
let sdkLive = false;
const CG = {
  init(cb){ sdkLive = !!window.gdsdk; cb && cb(); },
  loadingStart(){}, loadingStop(){}, gameplayStart(){}, gameplayStop(){}, happytime(){}, submitScore(s){},
  interstitial(){ try{ if (window.gdsdk && window.gdsdk.showAd) window.gdsdk.showAd().catch(function(){}); }catch(e){} },
  rewarded(onReward){
    try{ if (window.gdsdk && window.gdsdk.showAd){
      window.gdsdk.showAd("rewarded").then(function(){ onReward && onReward(); })
        .catch(function(){ onReward && onReward(); });
      return;
    } }catch(e){}
    onReward && onReward();
  },
};
CG.init(() => {});
// SDK:ADAPTER:END
'@

$headRe    = '(?s)<!-- SDK:HEAD:BEGIN.*?SDK:HEAD:END -->'
$adapterRe = '(?s)// SDK:ADAPTER:BEGIN.*?// SDK:ADAPTER:END'

foreach ($v in @(
  @{ dir = 'alt-builds\gamemonetize';    head = $gmHead; adapter = $gmAdapter },
  @{ dir = 'alt-builds\gamedistribution'; head = $gdHead; adapter = $gdAdapter }
)){
  $out = [regex]::Replace($src, $headRe, $v.head.Trim())
  $out = [regex]::Replace($out, $adapterRe, $v.adapter.Trim())
  $dir = Join-Path $PSScriptRoot $v.dir
  New-Item -ItemType Directory -Force $dir | Out-Null
  Set-Content -Encoding utf8 (Join-Path $dir 'index.html') $out
  Write-Host "wrote $($v.dir)\index.html"
}
