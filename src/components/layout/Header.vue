<script setup lang="ts"></script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-30 flex h-11 items-center gap-10 bg-emerald-900 shadow-md"
  >
    <div class="flex w-32 justify-center">
      <slot name="logo"></slot>
    </div>
    <nav class="flex w-full gap-3">
      <ul>
        <slot name="links"></slot>
      </ul>
    </nav>
  </header>
</template>

<style>
body {
  @apply pt-11;
}
</style>
