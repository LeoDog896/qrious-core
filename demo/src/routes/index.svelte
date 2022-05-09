<script lang="ts">
  const links = [
    { href: "/scannable/qr", name: "Demo" },
    { href: "https://github.com/LeoDog896/scannable", name: "GitHub" },
    { href: "https://npmjs.com/package/scannable", name: "NPM" }
  ]
</script>

<header class="
text-center p-8 w-full h-screen text-white
flex flex-col justify-center items-center
bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 background-animate"
>
  <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 drop-shadow-xl">Scannable</h1>

  <h2 class="text-3xl mb-4 drop-shadow-lg">Generate QR codes</h2>

  <div class="flex flex-row">
    {#each links as link}
      <a href={link.href} class="drop-shadow-md text-xl underline mx-4 hover:gray-100">{link.name}</a>
    {/each}
  </div>
</header>

<style>
  .background-animate {
    background-size: 400%;

    -webkit-animation: GradientAnimation 10s ease infinite;
    -moz-animation: GradientAnimation 10s ease infinite;
    animation: GradientAnimation 10s ease infinite;
  }

  @keyframes GradientAnimation {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>
