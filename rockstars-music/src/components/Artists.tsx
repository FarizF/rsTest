import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createTheme, Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import {
	DataGrid,
	GridColumns,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, TextField } from '@material-ui/core';
import { DataRowModel } from '@mui/x-data-grid-generator';
import { Artist } from '../models/artist';

interface QuickSearchToolbarProps {
	clearSearch: () => void;
	onChange: () => void;
	value: string;
}

function escapeRegExp(value: string): string {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
	(theme: Theme) =>
		createStyles({
			root: {
				padding: theme.spacing(0.5, 0.5, 0),
				justifyContent: 'space-between',
				display: 'flex',
				alignItems: 'flex-start',
				flexWrap: 'wrap',
			},
			textField: {
				[theme.breakpoints.down('xs')]: {
					width: '100%',
				},
				margin: theme.spacing(1, 0.5, 1.5),
				'& .MuiSvgIcon-root': {
					marginRight: theme.spacing(0.5),
				},
				'& .MuiInput-underline:before': {
					borderBottom: `1px solid ${theme.palette.divider}`,
				},
			},
		}),
	{ defaultTheme }
);

export default function Artists() {
	useEffect(() => {
		fetch(`http://localhost:3000/artists?id=${id}`)
			.then(res => res.json())
			.then(
				(result: Array<Artist>) => {
					
				},
				(error) => {
					
				}
			)
	}, [])

	type ArtistParam = { id: string, name: string }
	let { id } = useParams<ArtistParam>();

	const singleArtist = <div>{id}</div>;

	const allArtists = <div>
		<QuickFilteringGrid />
	</div>;

	let content: JSX.Element;

	if (id) content = singleArtist;
	else content = allArtists;


	return (<>{content}</>);
}

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div>
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
			</div>
			<TextField
				variant="standard"
				value={props.value}
				onChange={props.onChange}
				placeholder="Search…"
				className={classes.textField}
				InputProps={{
					startAdornment: <SearchIcon fontSize="small" />,
					endAdornment: (
						<IconButton
							title="Clear"
							aria-label="Clear"
							size="small"
							style={{ visibility: props.value ? 'visible' : 'hidden' }}
							onClick={props.clearSearch}
						>
							<ClearIcon fontSize="small" />
						</IconButton>
					),
				}}
			/>
		</div>
	);
}



export function QuickFilteringGrid() {

	let history = useHistory();

	const columns: GridColumns = [
		{ field: 'id', hide: true, editable: false },
		{ field: 'name', hide: false, editable: false, minWidth: 150, flex: 1 }
	]

	const [searchText, setSearchText] = useState('');
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [rows, setRows] = useState<DataRowModel[]>([]);
	const [filteredRows, setFilteredRows] = useState<DataRowModel[]>([]);

	useEffect(() => {
		fetch("http://localhost:3000/artists")
			.then(res => res.json())
			.then(
				(result: Array<Artist>) => {
					setIsLoaded(true);
					setRows(result);
					setFilteredRows(result);
				},
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			)
	}, [])

	const requestSearch = (searchValue: string) => {
		setSearchText(searchValue);
		const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
		setFilteredRows(rows.filter((row: any) => {
			return Object.keys(row).some((field: any) => {
				return searchRegex.test(row[field].toString());
			});
		}));
	};

	useEffect(() => {
		setRows(rows);
	}, [rows, filteredRows]);

	return (
		<div style={{ height: 600, width: '100%' }}>
			<DataGrid
				components={{ Toolbar: QuickSearchToolbar }}
				rows={filteredRows}
				columns={columns}
				componentsProps={{
					toolbar: {
						value: searchText,
						onChange: (event: any) => requestSearch(event.target.value),
						clearSearch: () => requestSearch(''),
					},
				}}
				onSelectionModelChange={(ids: any) => {
					history.push(`/artists/${ids[0]}`);
				}}
			/>
		</div>
	);
}