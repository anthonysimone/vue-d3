<template>
  <div class="error-404">
    <page-header pageTitle="404" subTitle="The page you are looking for does not exist!"></page-header>
    <div class="container">
      <section class="section">
        <p class="emoji-404">&#x1f62e;</p>
      </section>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/elements/layout/PageHeader'

export default {
  components: {
    PageHeader
  }
}
</script>

<style lang="scss">
.emoji-404 {
  font-size: 120px;
}
</style>
