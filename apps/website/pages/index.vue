<template>
  <div>
    <LandingHeroSection />
    <LandingFeaturesSection />
    <LandingTechStackSection />
    <LandingDownloadSection />
    <FaqSection />
    <LandingCtaSection />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'NoteX - Minimal, Local-first, Markdown Note Taking',
  meta: [
    { name: 'description', content: 'NoteX is a minimal, local-first, markdown-based note taking app. Privacy-focused, cross-platform, and cloud-syncable.' }
  ]
})
</script>
