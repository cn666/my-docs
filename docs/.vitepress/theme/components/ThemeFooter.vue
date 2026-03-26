<script setup>
import { withBase } from 'vitepress'

const beianHref =
  'https://beian.mps.gov.cn/#/query/webSearch?code=61011602000783'
const iconSrc = withBase('/images/footer.png')
</script>

<template>
  <footer class="beian-footer">
    <div class="beian-footer__container">
      <a
        class="beian-footer__link"
        :href="beianHref"
        rel="noreferrer"
        target="_blank"
      >
        <img
          class="beian-footer__icon"
          :src="iconSrc"
          alt="公安备案图标"
          width="16"
          height="16"
        />
        <span>陕公网安备61011602000783号</span>
      </a>
    </div>
  </footer>
</template>
