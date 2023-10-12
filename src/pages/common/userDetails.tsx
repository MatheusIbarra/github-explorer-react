import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  CircularProgress,
} from '@mui/material';

import HeaderBanner from 'src/components/headerBanner';
import { Repository, User } from 'src/models';
import { toast } from 'react-toastify';
import { api } from 'src/services/api';
import { maskHelper } from 'src/utils/maskHelper';

const UserDetails: React.FC = () => {
  const [user, setUser] = useState({} as User);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [repositories, setRepositories] = useState<Repository[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reposLoading, setReposLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useParams();

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const {
        data,
      }: {
        data: User;
      } = await api.get(`users/${login}/details`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setUser(data);
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

  const getRepositories = async () => {
    try {
      if (expandedAccordion) {
        setExpandedAccordion(false);
        return;
      }

      if (!expandedAccordion && repositories.length > 0) {
        setExpandedAccordion(true);
        return;
      }
      setReposLoading(true);
      const {
        data,
      }: {
        data: Repository[];
      } = await api.get(`users/${login}/repos`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setRepositories(data);
      setExpandedAccordion(true);
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
      setReposLoading(false);
    }
  };

  const openProfileUrl = () => {
    window.open(user.html_url, '_blank');
  };

  useEffect(() => {
    if (!loading) {
      getUserDetails();
    }
  }, []);

  return (
    <Box maxHeight="100vh">
      <HeaderBanner />
      <Box padding={2} flexDirection="row" display="flex" alignItems="center">
        <IconButton onClick={() => navigate('/')} size="medium">
          <Typography variant="h4">{'<'}</Typography>
        </IconButton>
        <Typography variant="h4">User Details</Typography>
      </Box>
      <Box padding={2} maxWidth={1050}>
        <Paper style={{ padding: 5, wordWrap: 'break-word' }}>
          {!loading ? (
            <>
              <Typography variant="h6">ID: {user.id}</Typography>
              <Typography variant="h6">Login: {user.login}</Typography>
              <Typography variant="h6" onClick={openProfileUrl}>
                Profile URL:{' '}
                <p
                  style={{
                    color: 'blue',
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {user.url}
                </p>
              </Typography>
              <Typography variant="h6">
                Login Creation Date:{' '}
                {maskHelper.formatDateAndTime(user.created_at)}
              </Typography>

              <Accordion
                expanded={expandedAccordion}
                onChange={getRepositories}
                style={{ marginTop: 20 }}
              >
                <AccordionSummary style={{ backgroundColor: '#1976d2' }}>
                  <Typography color="white">Repositories</Typography>
                  {reposLoading && (
                    <CircularProgress
                      style={{ color: 'white', marginLeft: '30px' }}
                      size={24}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails style={{ overflow: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {repositories.length > 0 &&
                        repositories?.map(row => (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell
                              onClick={() => {
                                window.open(row.html_url, '_blank');
                              }}
                              style={{
                                textDecorationLine: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              {row.html_url}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            <Skeleton />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UserDetails;
