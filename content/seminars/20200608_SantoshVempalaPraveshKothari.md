+++
title = "Outlier-robust Clustering of Gaussian Mixtures"
author = '''<a href="https://www.cc.gatech.edu/~vempala/" target="_blank">Santosh Vempala</a>,
            <a href="https://www.cs.princeton.edu/~kothari/" target="_blank">Pravesh Kothari</a>'''
date = "2020-06-08T21:00:00+05:30"
date_end = "2020-06-08T22:30:00+05:30"
location = "<a href="#">Location: Virtual Seminar</a>"
notes = ""
link_to_paper = ""
+++

We give efficient algorithms for robustly clustering of mixtures of "reasonable" distributions, including the well-known open problem of robustly clustering a mixture of arbitrary Gaussians. In the first part of the talk, we focus on the case of k=2 component distributions, where we first show that separation of the means (in affine-invariant Mahalanobis distance) or covariances suffices. Our algorithm and analysis extend naturally to robustly clustering mixtures of well-separated strongly log-concave distributions. We also show that for Gaussian mixtures, separation in total variation distance suffices to achieve robust clustering. Our main tools are a new identifiability criterion based on isotropic position and the Fisher discriminant, and a corresponding Sum-of-Squares convex programming relaxation, of fixed degree.
<br><br>
In the second part of the talk, we will discuss the case of $k > 2$ and give an outlier-robust efficient algorithm for clustering a mixture of k Gaussians with pairwise TV distance 1-exp(k^k/\eta). The running time of our algorithm is d^{(k/\eta)^{O(k)}}. More generally, our algorithm succeeds for mixtures of distributions that satisfy two well-studied analytic assumptions - certifiable hypercontractivity and anti-concentration. Thus, it extends to clustering mixtures of arbitrary affine transforms of the uniform distribution on the d-dimensional unit sphere. Even the information-theoretic clusterability of distributions satisfying our analytic assumptions was not known and is likely to be of independent interest. Our techniques expand the sum-of-squares toolkit to show robust certifiability of TV-separated Gaussian clusters in data. This involves a low-degree sum-of-squares proof of statements that relate parameter distance to total variation distance simply relying on hypercontractivity and anti-concentration.
<br><br>
It remains open to improve the running time of the algorithms and to give a robust parameter estimation algorithm for Gaussian mixtures with no separation assumptions.
<br><br>
 Based on joint works with He Jia (Georgia Tech) and Ainesh Bakshi (CMU).