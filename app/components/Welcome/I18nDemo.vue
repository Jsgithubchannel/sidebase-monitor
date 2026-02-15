<template>
  <div class="layout">
    <div class="group">
      <h1 class="heading">
        {{ $t('title') }}
      </h1>
      <p class="description">
        {{ $t('description') }}
      </p>
    </div>
    <div class="group">
      <div class="actions">
        <WelcomeButtonLink href="https://i18n.nuxtjs.org/" :blank="true">
          Documentation
        </WelcomeButtonLink>
      </div>
    </div>
  </div>
</template>
