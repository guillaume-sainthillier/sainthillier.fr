<?php
require __DIR__ . '/../required/init.php';

$realisations = getRealisations();
$competences = getCompetences();
$experiences = getExperiences();
krsort($experiences); //Sort by year ASC

echo render('index.html.twig', [
    'realisations' => $realisations,
    'competences' => $competences,
    'experiences' => $experiences,
]);
