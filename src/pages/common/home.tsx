import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  CircularProgress,
  Skeleton,
  TextField,
} from '@mui/material';
import HeaderBanner from 'src/components/headerBanner';
import { User } from 'src/models';
import { api } from 'src/services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

interface PaginationProps {
  currentPage: number;
  perPage: number;
  totalCount: number;
  nextSince: number;
}

const INIT_PAGINATION = {
  currentPage: 0,
  perPage: 10,
  totalCount: 1000,
  nextSince: 0,
};

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] =
    useState<PaginationProps>(INIT_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [renderHistory, setRenderHistory] = useState<any>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const getUsers = async (resetPagination = false) => {
    try {
      setLoading(true);
      const {
        data,
      }: {
        data: {
          results: User[];
          pagination: PaginationProps;
        };
      } = await api.get('/users', {
        params: {
          since: pagination.nextSince,
          perPage: pagination.perPage,
          q: search,
        },
      });
      if (!resetPagination) {
        renderHistory.push(data.results);
        setRenderHistory([...renderHistory]);

        const { perPage, totalCount } = data.pagination;

        setPagination({
          ...pagination,
          perPage,
          totalCount,
        });
      } else {
        setPagination(INIT_PAGINATION);
        setRenderHistory([]);
      }
      setUsers(data.results);
    } catch (error) {
      toast.error('An error has occurred', {
        position: 'bottom-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      getUsers();
    }
  }, [pagination.currentPage, pagination.perPage]);

  useEffect(() => {
    setLoading(true);
    if (search.length < 2) {
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      getUsers(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  return (
    <Box maxHeight="100vh">
      <HeaderBanner />
      <Box padding={2}>
        <Typography variant="h4">Users</Typography>
        <TableContainer component={Paper}>
          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
            }}
            padding={2}
          >
            <TextField
              fullWidth
              label="Search User"
              onChange={e => setSearch(e.target.value)}
              value={search}
            />
            {loading && (
              <CircularProgress
                style={{ position: 'absolute', right: 180 }}
                size={24}
              />
            )}
            <Button
              onClick={() => {
                getUsers();
              }}
              style={{ marginLeft: 20 }}
              variant="contained"
            >
              Reset Search
            </Button>
          </Box>
          {loading ? (
            <Box padding={5}>
              <Skeleton height={50} variant="text" />
              <Skeleton height={50} variant="text" />
              <Skeleton height={50} variant="text" />
            </Box>
          ) : (
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 &&
                  users?.map(row => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.login}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            navigate(`/details/${row.login}`);
                          }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          {search.length === 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pagination.totalCount}
              rowsPerPage={pagination.perPage}
              page={pagination.currentPage}
              onPageChange={(_, page) => {
                setPagination({
                  ...pagination,
                  currentPage: page,
                  nextSince:
                    page < pagination.currentPage
                      ? renderHistory[page === 0 ? 1 : page + 1][0].id
                      : users[users.length - 1].id,
                });
              }}
              onRowsPerPageChange={e => {
                setPagination({
                  ...INIT_PAGINATION,
                  perPage: Number(e.target.value),
                });
                setRenderHistory([[]]);
              }}
            />
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Home;
