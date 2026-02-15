<script setup lang="ts">
const { $client } = useNuxtApp()

// 모니터링할 사이드베이스 레포지토리 목록
const repoList = ['sidebase', 'nuxt-auth', 'nuxt-session', 'nuxt-parse']

// tRPC를 사용하여 데이터 로드
const { data: results, pending, error } = await useAsyncData('repo-stats', async () => {
  return await Promise.all(
    repoList.map(name => $client.github.getStats.query(name))
  )
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans">
    <header class="max-w-6xl mx-auto mb-16 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        SIDEBASE MONITOR
      </h1>
      <p class="text-slate-400 text-lg">
        Real-time status of the Sidebase ecosystem
      </p>
    </header>

    <main class="max-w-6xl mx-auto">
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        <div v-for="i in 4" :key="i" class="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>

      <div v-if="error" class="text-red-400 bg-red-900/20 p-4 rounded-lg">
        <p class="font-bold">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <pre class="text-xs mt-2 text-left bg-black p-2 rounded">{{ error }}</pre>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="repo in results" :key="repo.id"
          class="group relative bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              {{ repo.name }}
            </h3>
            <span class="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">v3.0</span>
          </div>

          <p class="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
            {{ repo.description || 'No description provided' }}
          </p>

          <div class="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
            <div class="flex items-center gap-2">
              <span class="text-amber-400 text-lg">★</span>
              <span class="font-bold text-slate-200">{{ repo.stargazers_count.toLocaleString() }}</span>
            </div>
            <a
              :href="repo.html_url" target="_blank"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
            >
              Explore →
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
