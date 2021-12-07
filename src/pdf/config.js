class PdfConfig {
	constructor() {
		this.year = 2021;
		this.month = 0;
		this.months = 12;
		this.fontFamily = 'Lato';
		this.fontDefinition = {
			family: this.fontFamily,
			fonts: [
				{ src: '/fonts/Lato/Lato-Regular.ttf' },
				{ src: '/fonts/Lato/Lato-Italic.ttf', fontStyle: 'italic' },
				{ src: '/fonts/Lato/Lato-Bold.ttf', fontWeight: 700 },
				{ src: '/fonts/Lato/Lato-BoldItalic.ttf', fontStyle: 'italic', fontWeight: 700 },
			],
		};
	}
}

export default PdfConfig;
