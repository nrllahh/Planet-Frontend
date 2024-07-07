import React, { useEffect } from 'react'
import { redirect, useParams } from 'react-router-dom'
import { acceptInvitation } from '../services/boardService';

export default function InvitationPage() {
    const {key} = useParams();

    async function beginAcceptInvitation() {
        await acceptInvitation(key);
        redirect("/");
    }

    useEffect(() => {
        beginAcceptInvitation();
    }, []);
  return (
    <></>
  )
}
