import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import '@/index.css'

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Nzk0OTQzOTksImp0aSI6ImJmMTkzOGI2LTViZWItNDQzYS1hN2QyLWMyMzdkNmFlMDkyZSIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNTZiZjEwMDkifQ.9-QucWEr-6A-3g2u7DOiKYYg38S3Ty7Bf_7kawNn70Tz-qKk4VCXtH2bEK4qbqF1jMuA0CF-dt4tsFYh8yNzwQ';

interface CkEditorProps {
	value?: string;
	onChange?: (data: string) => void;
}

export default function CkEditor({ value = '', onChange }: CkEditorProps) {
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const cloud = useCKEditorCloud({ version: '46.1.1' });

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { ClassicEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== 'success' || !isLayoutReady) {
			return {};
		}

		const {
			ClassicEditor,
			Autosave,
			Bold,
			Essentials,
			Italic,
			Paragraph,
			PlainTableOutput,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableLayout,
			TableProperties,
			TableToolbar
		} = cloud.CKEditor;

		return {
			ClassicEditor,
			editorConfig: {
				toolbar: {
					items: ['undo', 'redo', '|', 'bold', 'italic', '|', 'insertTable', 'insertTableLayout'],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Autosave,
					Bold,
					Essentials,
					Italic,
					Paragraph,
					PlainTableOutput,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableLayout,
					TableProperties,
					TableToolbar
				],
				initialData: value || "",
				licenseKey: LICENSE_KEY,
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [cloud, isLayoutReady, value]);

	return (
		<div ref={editorRef}>
			{ClassicEditor && editorConfig && (
				<CKEditor 
					editor={ClassicEditor} 
					config={editorConfig}
					data={value}
					onChange={(_event, editor) => {
						const data = editor.getData();
						onChange?.(data);
					}}
				/>
			)}
		</div>
	);
}
