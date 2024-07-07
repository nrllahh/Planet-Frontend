import {
  Container,
  Grid,
  Box,
  Pagination,
  Divider,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserBoard from "../components/UserBoard";
import { getUserBoards } from "../services/boardService";
import { redirect } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import MainPaper from "../components/MainPaper";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useAuth } from "../contexts/AuthContext";
import CreateBoardModal from "../components/CreateBoardModal";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CommentIcon from '@mui/icons-material/Comment';
import { getStatistics } from "../services/userService";

export default function HomePage() {
  const userBoards = useSelector((state) => state.board.userBoards);
  const statistics = useSelector(state => state.user.statistics);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const {user} = useAuth();

  function handleCreateBoardModalClose() {
    setIsCreateBoardModalOpen(false);
  }

  function handleCreateBoardModalOpen() {
    setIsCreateBoardModalOpen(true);
  }

  async function fetchData() {
    await getStatistics();
    const response = await getUserBoards({
      pageSize: 8,
      currentPage: currentPage,
    });

    setCurrentPage(response.body.currentPage);
    setPageCount(response.body.pageCount);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <MainLayout>
      <CreateBoardModal open={isCreateBoardModalOpen} onClose={handleCreateBoardModalClose}  />
      <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item md={8}>
          <MainPaper title="Aktif Panolarım" icon={<DashboardIcon />}>
            <Container>
              <Button onClick={handleCreateBoardModalOpen} variant="text" color="turqoise" sx={{display: "block", ml:"auto", mb:2}}>PANO OLUŞTUR</Button>
              <Grid container spacing={2}>
                {userBoards.map((value, index) => (
                  <Grid key={index} item xs={6} md={3}>
                    <UserBoard boardId={value.id} title={value.title} current={index+1} total={userBoards.length} />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} orientation="horizontal" />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  color="turqoise"
                  count={pageCount}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                />
              </Box>
            </Container>
          </MainPaper>
        </Grid>
        <Grid item md={4}>
          <MainPaper title="Profilim" icon={<PersonOutlineIcon />}>
            <Box display="flex" justifyContent="center">
              <Avatar sx={{width: 120, height: 120}} />
            </Box>
            <Typography marginTop={1} fontSize={20} fontWeight={500} align="center">{user.name}</Typography>
            <Typography marginTop={0.5} fontSize={14} fontWeight={300} align="center">{user.email}</Typography>
            {statistics && (
              <Stack mt={3} p={1} gap={1} direction="row" flexWrap="wrap">
                <Chip icon={<StickyNote2Icon />} label={`Kartlar : ${statistics.cardOwnerCount}`} variant="filled" color="secondary" />
                <Chip icon={<DashboardIcon />} label={`Panolar : ${statistics.boardMemberCount}`} variant="filled" color="success" />
                <Chip icon={<CommentIcon />} label={`Yorumlar : ${statistics.cardCommentCount}`} variant="filled" color="primary" />
                <Chip icon={<AssignmentIndIcon />} label={`Görevler : ${statistics.cardAssignedCount}`} variant="filled" color="error" />
              </Stack>
            )}
          </MainPaper>
        </Grid>
      </Grid>
      </Container>
    </MainLayout>
  );
}
