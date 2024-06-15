<script setup lang="ts"></script>

<template>
  <header class="fixed flex gap-10 top-0 left-0 right-0 items-center h-11 bg-emerald-900 z-30">
    <div class="w-32 flex justify-center">
      <slot name="logo"></slot>
    </div>
    <nav class="flex gap-3 w-full">
      <ul>
        <slot name="links"></slot>
      </ul>
    </nav>
  </header>
</template>
