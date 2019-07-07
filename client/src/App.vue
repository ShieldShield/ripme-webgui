<template>
	<div id="app" class="container py-5">
		<h1 class="fs-h1 text-center">
			Ripme Web Gui
		</h1>

		<div class="nav text-center mt-3">
			<router-link to="/">Automatic</router-link>
			<router-link to="/single">Once</router-link>
			<router-link to="/settings">Settings</router-link>
			<router-link to="/about">About</router-link>
		</div>

		<div class="main-content mt-5">
			<router-view />
		</div>
		<vue-snotify></vue-snotify>
	</div>
</template>

