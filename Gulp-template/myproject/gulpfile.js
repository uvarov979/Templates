var gulp 				= require('gulp'),
		sass 				= require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat 			 = require('gulp-concat'),
		uglify 			 = require('gulp-uglifyjs'),
		cssnano			 = require('gulp-cssnano'),
		rename			 = require('gulp-rename'),
		del					 =	require('del'),
		imagemin		 = require('gulp-imagemin'),
		pngquant		 = require('imagemin-pngquant'),
		cache				 = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer');

//какие файлы будут изменяться
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

//browser-sync что бы сразу проектировать всё в браузере без перезапуска
gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir:'app'
		},
		notifi: false
	});
});

//зжaтие файлов
gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

// сжымает все либы, очень долго еще понимать
gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

//стили будут сразу изменяться, без запуска команд консоли 
gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

//чистит дэск пр перезапуске(перезаписи)
gulp.task('clean', function(){
	return del.sync('dist');
});

//Что то делает с изображением???(сжимает и в кэш его кидает)
gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}], 
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

//??? Перенос из эд в виск( я так понял уже сжатые)
gulp.task('build', ['clean', 'img', 'sass', 'scripts'],  function(){
	var buildCss = gulp.src([
			'app/css/main.css',
			'app/css/libs.min.css',
		])
			.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
			.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
			.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
			.pipe(gulp.dest('dist'));
});

//чистит кэш м изображением
gulp.task('clear', function(){
	return cache.clearAll();
});





/*gulp.task('mytask', function(){
	return gulp.src('source-files')
	.pipe(plugin())
	.pipe(gulp.dest('folder'))
});*/