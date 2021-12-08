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
				{
					src: '/fonts/Lato/Lato-BoldItalic.ttf',
					fontStyle: 'italic',
					fontWeight: 700,
				},
			],
		};
		this.pageSize = [ '157mm', '209mm' ];
		this.specialDates = {
			'01-01': [ 'Special date 1', 'Special date for reason #2' ],
			'03-01': [ 'Some other celebration' ],
			'13-01': [
				'Some other other celebration that is very long',
				"Let's add another one",
			],
			'14-01': [ 'Ran out of reasons celebration' ],
		};
	}
}

export default PdfConfig;
