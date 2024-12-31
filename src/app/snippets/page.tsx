"use client";
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import NavBar from './_components/NavBar';
import { api } from '../../../convex/_generated/api';

const SnippetPage = () => {
  const snippets = useQuery(api.snippets.getSnippet);
  const [search, setSearch] = useState("");
  const [filteredLanguage, setFilteredLanguage] = useState<string | null>(null)
  const [view, setView] = useState<"grid" | "list">("grid")
  return (
    <>
      <NavBar />
    </>
  )
}

export default SnippetPage