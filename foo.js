console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
	// use in production
	console.log('a');
}
else {
	// use on debugging
	console.log('b');
}