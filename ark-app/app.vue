<template>
  <div>
    <NuxtPage />
  </div>
</template>
<style>
/* Global scrollbar styles */
::-webkit-scrollbar {
  width: 6px; /* Make the scrollbar narrow */
  height: 6px; /* For horizontal scrollbar */
}

::-webkit-scrollbar-track {
  background: #f0f0f000; /* Light gray background */
  border-radius: 6px; /* Rounded corners */
}

::-webkit-scrollbar-thumb {
  background-color: #b0b0b0; /* Gray thumb */
  border-radius: 6px; /* Rounded corners */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* Darker gray on hover */
}
</style>
